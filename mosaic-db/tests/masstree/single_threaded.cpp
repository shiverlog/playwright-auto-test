#include <gtest/gtest.h>
#include <numa.h>
#include <sched.h>
#include <sys/mman.h>
#include <array>
#include <vector>

#include <dbcore/sm-coroutine.h>
#include <masstree/masstree_btree.h>
#include <varstr.h>

#include "record.h"

template <typename T>
using task = ermia::dia::task<T>;


ermia::TXN::xid_context *mock_xid_get_context() {
    static ermia::XID dummy_xid = ermia::XID::make(0, 0);
    static ermia::TXN::xid_context dummy_xid_context;
    dummy_xid_context.begin_epoch = 0;
    dummy_xid_context.owner = dummy_xid;
    dummy_xid_context.xct = nullptr;
    return &dummy_xid_context;
}


ermia::epoch_num mock_get_cur_epoch() {
    return 0;
}


class SingleThreadMasstree : public ::testing::Test {
   protected:
    virtual void SetUp() override {
        tree_ = new ermia::ConcurrentMasstree();
    }

    virtual void TearDown() override {
        delete tree_;
    }

    PROMISE(bool) insertRecord(const Record &record) {
        RETURN AWAIT tree_->insert(
            ermia::varstr(record.key.data(), record.key.size()), record.value,
            mock_xid_get_context(), nullptr, nullptr);
    }

    PROMISE(bool)
    searchByKey(const std::string &key, ermia::OID *out_value) {
        RETURN AWAIT tree_->search(ermia::varstr(key.data(), key.size()),
                                   *out_value, mock_get_cur_epoch(), nullptr);
    }

    ermia::ConcurrentMasstree *tree_;
    ermia::dia::coro_task_private::memory_pool pool_;
};

TEST_F(SingleThreadMasstree, InsertSequential) {
    Record record = Record{"absd", 1423};
    EXPECT_TRUE(sync_wait_coro(insertRecord(record)));
}

TEST_F(SingleThreadMasstree, InsertSequentialAndSearchSequential) {
    Record record = Record{"absd", 1423};
    EXPECT_TRUE(sync_wait_coro(insertRecord(record)));

    ermia::OID value_out;
    EXPECT_TRUE(sync_wait_coro(searchByKey(record.key, &value_out)));
    EXPECT_EQ(record.value, value_out);

    EXPECT_FALSE(sync_wait_coro(searchByKey("ccc", &value_out)));
}

TEST_F(SingleThreadMasstree, InsertSequentialAndSearchSequential_ManyRecords) {
    const std::vector<Record> records_to_insert = genRandRecords(400, 128);
    for (const Record &record : records_to_insert) {
        EXPECT_TRUE(sync_wait_coro(insertRecord(record)));
    }

    for (const Record &record : records_to_insert) {
        ermia::OID value_out;
        EXPECT_TRUE(sync_wait_coro(searchByKey(record.key, &value_out)));
        EXPECT_EQ(record.value, value_out);
    }

    ermia::OID value_out;
    std::string non_key = genKeyNotInRecords(records_to_insert);
    EXPECT_FALSE(sync_wait_coro(searchByKey(non_key, &value_out)));
}


#ifdef NESTED_COROUTINE

TEST_F(SingleThreadMasstree, InsertSequentialAndSearchInterleaved) {
    std::vector<Record> records_to_insert = genRandRecords(50, 10);
    for (const Record &record : records_to_insert) {
        EXPECT_TRUE(sync_wait_coro(insertRecord(record)));
    }

    std::vector<ermia::OID> coro_return_values;
    coro_return_values.resize(records_to_insert.size());

    constexpr int task_queue_size= 5;
    std::array<task<bool>, task_queue_size> task_queue;
    std::array<
        ermia::dia::coro_task_private::coro_stack,
        task_queue_size> coro_stacks;

    uint32_t next_task_index = 0;

    for (uint32_t i = 0; i < task_queue_size; i++) {
        task<bool> &coro_task = task_queue[i];
        const Record & record = records_to_insert[next_task_index];
        ermia::OID & result = coro_return_values[next_task_index];
        next_task_index++;
        coro_task = searchByKey(record.key, &result);
    }

    uint32_t completed_task_cnt = 0;
    while (completed_task_cnt < records_to_insert.size()) {
        for(uint32_t i = 0; i < task_queue_size; i++) {
            task<bool> &coro_task = task_queue[i];
            if(!coro_task.valid()) {
                continue;
            }

            if(!coro_task.done()) {
                coro_task.resume();
            } else {
                EXPECT_TRUE(coro_task.get_return_value());
                completed_task_cnt++;

                if(next_task_index < records_to_insert.size()) {
                    const Record & record = records_to_insert[next_task_index];
                    ermia::OID & result = coro_return_values[next_task_index];
                    next_task_index++;
                    coro_task = searchByKey(record.key, &result);
                } else {
                    coro_task = task<bool>(nullptr);
                }
            }
        }
    }

    for(uint32_t i = 0; i < records_to_insert.size(); i++) {
        EXPECT_EQ(records_to_insert[i].value, coro_return_values[i]);
    }

    for(task<bool> & coro_task : task_queue) {
        EXPECT_TRUE(!coro_task.valid() || coro_task.done());
    }
}

TEST_F(SingleThreadMasstree, InsertAndSearchAllInterleaved) {
    constexpr uint32_t iterations = 50;
    constexpr uint32_t record_num_per_iter = 20;

    /*
     * Interleaved search and insert in each iteration.
     * In every iteration, it searchs the records inserted in last interation.
     */

    // Initially insert a batch of records
    std::vector<Record> cur_iter_records = genRandRecords(record_num_per_iter);
    for(const Record & record : cur_iter_records) {
       EXPECT_TRUE(sync_wait_coro(insertRecord(record)));
    }

    constexpr uint32_t task_queue_size = 2 * record_num_per_iter;
    std::array<task<bool>, task_queue_size> task_queue;
    std::array<ermia::OID, task_queue_size> return_values;

    std::vector<Record> last_iter_records;
    for(uint32_t i = 0; i < iterations; i++) {
        uint32_t completed_task_cnt = 0;
        last_iter_records = cur_iter_records;
        // Ensure records inserting this iteration differs from any of last iteration
        cur_iter_records = genDisjointRecords(last_iter_records, record_num_per_iter);

        uint32_t task_index = 0;
        for(const Record & search_record : last_iter_records) {
            task_queue[task_index] =
                searchByKey(search_record.key, &return_values[task_index]);
            task_index++;
        }
        for(const Record & insert_record : cur_iter_records) {
            task_queue[task_index] = insertRecord(insert_record);
            task_index++;
        }
        EXPECT_EQ(task_index, task_queue.size());

        while (completed_task_cnt < task_queue.size()) {
            for(uint32_t j = 0; j < task_queue.size(); j++) {
                task<bool> & coro_task = task_queue[j];
                if(!coro_task.valid()) {
                    continue;
                }

                if(!coro_task.done()) {
                    coro_task.resume();
                } else {
                    EXPECT_TRUE(coro_task.get_return_value());
                    completed_task_cnt++;
                    coro_task = task<bool>(nullptr);
                }
            }
        }

        for(uint32_t k = 0; k < last_iter_records.size(); k++) {
            EXPECT_EQ(last_iter_records[k].value, return_values[k]);
        }
    }

}

#endif  // NESTED_COROUTINE

