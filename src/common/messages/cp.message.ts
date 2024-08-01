export const CP_MESSAGE_CONSTANT = {
  AUTH: {
    SIGN_UP: {
      SUCCEED: '업체 회원가입 성공.',
      FAILED: '회원가입중 오류가 발생했습니다.',
      NOT_MATCHED_PASSWORD: '비밀번호가 일치 하지 않습니다.',
      EXISTED_EMAIL: '이미 존재하는 이메일입니다.',
    },
    SIGN_IN: {
      SUCCEED: '로그인 성공',
      FAILED: '이미 로그인 하셨습니다.',
    },
    SIGN_OUT: {
      NORECORD: '로그인한 기록이 없습니다.',
      SUCCEED: '로그아웃 성공',
      ALREADYOUT: '이미 로그아웃 되었습니다.',
    },
    COMMON: {
      TOKEN_SUCCEED: '토큰 재발급 성공',
      INVALID_TOKEN: '유효하지 않은 토큰 입니다.',
      HASH_ERROR: '비밀번호 해싱 중 오류가 발생했습니다.',
      CONFIRM_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
  },
  LESSON: {
    REVIEW: {
      FIND_REVIEWS: '리뷰 조회 성공',
      NOT_FOUND: '리뷰가 존재하지 않습니다.',
    },
    COMMENT: {
      UPDATE_COMMENT: '답글 수정 성공',
      DELETE_COMMENT: '답글 삭제 성공',
      CREATE_COMMENT: '리뷰 답글 작성 성공',
      EXIST_COMMENT: '이미 작성한 답글이 존재합니다',
      FAILED: '리뷰 답글 작성에 실패 하였습니다.',
    },
  },
}
