import Allure from '@allure';
import { test } from '@base-test';
import DatabaseStep from '@dbSteps/DatabaseStep';
import ExcelUtil from '@utils/ExcelUtil';

const testData = ExcelUtil.getTestDataArray('DatabaseTest');
// eslint-disable-next-line no-restricted-syntax
for (const data of testData) {
  test(`${data.TestID} - ${data.Description}`, async ({}) => {
    Allure.attachDetails(data.Description, data.Issue);
    const db = new DatabaseStep();
    const result = await db.executeMSSQLQuery(data.Query);
    await db.verifyExecutionSuccess(result.rowsAffected[0]);
  });
}
