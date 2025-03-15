/**
 * Description : config.ts - 📌 Mosaic DB 관련 상수 정의
 * Author : Shiwoo Min
 * Date : 2024-03-10
 */
export default class DBConstants {
  // Mosaic DB에 연결
  static readonly CONNECT_DB = 'Connect to Mosaic DB';
  // Mosaic DB 연결 해제
  static readonly DISCONNECT_DB = 'Disconnect from Mosaic DB';
  // Mosaic DB 쿼리 실행
  static readonly EXECUTE_QUERY = 'Execute Mosaic DB Query';
  // Mosaic DB 쿼리 성공
  static readonly QUERY_SUCCESS = 'Mosaic DB Query Success';
  // Mosaic DB 쿼리 실패
  static readonly QUERY_FAILURE = 'Mosaic DB Query Failure';
  // Mosaic DB 연결 오류
  static readonly CONNECTION_ERROR = 'Mosaic DB Connection Error';
  // Mosaic DB 트랜잭션 시작
  static readonly TRANSACTION_START = 'Start Mosaic DB Transaction';
  // Mosaic DB 트랜잭션 커밋
  static readonly TRANSACTION_COMMIT = 'Commit Mosaic DB Transaction';
  // Mosaic DB 트랜잭션 롤백
  static readonly TRANSACTION_ROLLBACK = 'Rollback Mosaic DB Transaction';
  // Mosaic DB 연결 타임아웃
  static readonly CONNECTION_TIMEOUT = 'Mosaic DB Connection Timeout';
  // Mosaic DB 인증 실패
  static readonly AUTHENTICATION_FAILED = 'Mosaic DB Authentication Failed';
  // Mosaic DB 세션 만료
  static readonly SESSION_EXPIRED = 'Mosaic DB Session Expired';
  // Mosaic DB 읽기 전용 모드
  static readonly READ_ONLY_MODE = 'Mosaic DB Read-Only Mode';
  // Mosaic DB 쓰기 가능 모드
  static readonly WRITE_MODE = 'Mosaic DB Write Mode';
  // Mosaic DB에서 사용할 최대 연결 개수
  static readonly MAX_CONNECTIONS = 'Mosaic DB Max Connections';
  // Mosaic DB에서 사용할 기본 스키마
  static readonly DEFAULT_SCHEMA = 'Mosaic DB Default Schema';
  // Mosaic DB 테이블 잠금
  static readonly TABLE_LOCK = 'Mosaic DB Table Lock';
  // Mosaic DB 테이블 잠금 해제
  static readonly TABLE_UNLOCK = 'Mosaic DB Table Unlock';
  // Mosaic DB 데이터 커밋 중 오류 발생
  static readonly COMMIT_ERROR = 'Mosaic DB Commit Error';
  // Mosaic DB 데이터 롤백 중 오류 발생
  static readonly ROLLBACK_ERROR = 'Mosaic DB Rollback Error';
  // Mosaic DB에서의 데이터 중복 오류
  static readonly DUPLICATE_ENTRY_ERROR = 'Mosaic DB Duplicate Entry Error';
  // Mosaic DB에서의 데이터 무결성 오류
  static readonly DATA_INTEGRITY_ERROR = 'Mosaic DB Data Integrity Error';
  // Mosaic DB에서 테이블이 존재하지 않는 경우 오류
  static readonly TABLE_NOT_FOUND = 'Mosaic DB Table Not Found';
  // Mosaic DB에서 컬럼이 존재하지 않는 경우 오류
  static readonly COLUMN_NOT_FOUND = 'Mosaic DB Column Not Found';
  // Mosaic DB에서 권한 부족 오류
  static readonly PERMISSION_DENIED = 'Mosaic DB Permission Denied';
}
