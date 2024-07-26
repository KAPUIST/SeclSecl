export const MAIN_MESSAGE_CONSTANT = {
  AUTH: {
    SIGN_UP: {
      SUCCEED: '회원가입 성공.',
      FAILED: '회원가입중 오류가 발생했습니다.',
      NOT_MATCHED_PASSWORD: '비밀번호가 일치 하지 않습니다.',
      EXISTED_EMAIL: '이미 존재하는 이메일입니다.',
      EXISTED_NICKNAME: '이미 존재하는 닉네임 입니다.',
    },
    VERIFICATION_PHONE: {
      EXIST_PHONE: '이미 가입된 핸드폰 번호입니다.',
      FAILED: '인증코드 전송에 실패 하였습니다.',
      NOT_VERIFIED: '휴대폰 인증을 해주세요.',
    },
    SIGN_IN: {
      SUCCEED: '로그인 성공',
      FAILED: '유효성 검사 중 오류가 발생했습니다.',
    },
    COMMON: {
      INVALID_TOKEN: '유효하지 않은 토큰 입니다.',
      HASH_ERROR: '비밀번호 해싱 중 오류가 발생했습니다.',
      CONFIRM_PASSWORD: {
        REQUIRED: '비밀번호 확인을 입력해 주세요.',
        INVALID_TYPE:
          '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 6자리 이상으로 입력해야 합니다.',
      },
    },
  },
  BAND: {
    BAND_GROUP: {
      CREATE_BAND: {
        SUCCEED: '밴드 생성에 성공하였습니다.',
        CONFLICT_NAME: '이미 존재하는 밴드명입니다.',
      },
      GET_BAND_List: {
        SUCCEED: '밴드 목록 조회에 성공하였습니다.',
      },
      GET_BAND_Detail: {
        SUCCEED: '밴드 상세 조회에 성공하였습니다.',
        NOT_FOUND: ' 존재하지 않는 밴드입니다.',
      },
      UPDATE_BAND: {
        SUCCEED: '밴드 수정에 성공하였습니다.',
        BAD_REQUEST: '밴드명, 설명 중 한가지는 입력해야 합니다.',
        NOT_FOUND: '존재하지 않거나 해당 밴드의 오너가 아닙니다.',
        UNAUTHORIZED: '밴드의 오너만 수정할 수 있습니다',
      },
      DELETE_BAND: {
        SUCCEED: '밴드 삭제에 성공하였습니다.',
        NOT_FOUND: '존재하지 않거나 해당 밴드의 오너가 아닙니다.',
      },
      JOIN_BAND: {
        SUCCEED: '밴드 가입에 성공하였습니다.',
      },
    },
    COMMON: {
      BAND_ENTITY: {
        UID: {
          REQUIRED: '밴드 UID를 입력해 주세요',
        },
        NAME: {
          REQUIRED: '밴드명을 입력해 주세요',
        },
        CONTENT: {
          REQUIRED: '밴드 설명을 입력해 주세요',
        },
      },
    },
  },
}
