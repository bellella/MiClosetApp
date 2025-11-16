/**
 * 앱 전역에서 사용할 커스텀 에러 클래스
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 장바구니 관련 에러
 */
export class CartError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 400);
    this.name = "CartError";
  }
}

/**
 * 결제 관련 에러
 */
export class CheckoutError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 400);
    this.name = "CheckoutError";
  }
}

/**
 * 네트워크 에러
 */
export class NetworkError extends AppError {
  constructor(message: string = "네트워크 연결을 확인해주세요") {
    super(message, "NETWORK_ERROR", 503);
    this.name = "NetworkError";
  }
}
