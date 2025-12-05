import axios, { AxiosRequestConfig } from "axios";

// 1. 기본 설정
export const AXIOS_INSTANCE = axios.create({
  // 주의: 안드로이드 에뮬레이터는 'http://10.0.2.2:3000', iOS 시뮬레이터는 'http://localhost:3000'
  // 일단 localhost로 해두고, 나중에 환경변수(process.env.EXPO_PUBLIC_API_URL)로 빼는 게 좋습니다.
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 2. Orval이 사용할 커스텀 요청 함수 (이 함수 껍데기를 Orval이 가져다 씁니다)
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
