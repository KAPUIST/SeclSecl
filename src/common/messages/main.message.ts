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
    REFRESH_TOKEN: {
      SUCCEED: '토큰 갱신에 성공했습니다.',
    },
    COMMON: {
      FAILED: '토큰 생성에 실패 하였습니다.',
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
        TRANSACTION_ERROR: '밴드 생성중 오류가 생겼습니다.',
      },
      GET_BAND_List: {
        SUCCEED: '밴드 목록 조회에 성공하였습니다.',
      },
      GET_BAND_Detail: {
        SUCCEED: '밴드 상세 조회에 성공하였습니다.',
        NOT_FOUND: '존재하지 않는 밴드입니다.',
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
        NOT_FOUND: '존재하지 않는 밴드입니다.',
      },
      GET_BAND_MEMBER: {
        SUCCEED: '밴드 멤버 조회에 성공하였습니다.',
        NOT_FOUND: '존재하지 않는 밴드입니다.',
      },
      TRANSFER_Band: {
        SUCCEED: '밴드장 이전에 성공하였습니다.',
        NOT_FOUND: '존재하지 않거나 해당 밴드의 오너가 아닙니다.',
        NOT_FOUND_USER: '해당 유저는 밴드 멤버가 아닙니다.',
        CONFLICT: '이미 해당 밴드의 오너입니다.',
      },
    },
    BAND_POSTS: {
      CREATE_BAND_POST: {
        SUCCEED: '밴드 게시물 생성에 성공하였습니다.',
        NOT_FOUND: '존재하지 않는 밴드입니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
      },
      GET_BAND_POST_LIST: {
        SUCCEED: '밴드 게시물 목록 조회에 성공하였습니다.',
        NOT_FOUND: '존재하지 않는 밴드입니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
      },
      GET_BAND_POST_DETAIL: {
        SUCCEED: '밴드 게시물 상세 조회에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
      },
      UPDATE_BAND_POST: {
        SUCCEED: '밴드 게시물 수정에 성공하였습니다.',
        BAD_REQUEST: '게시물 제목, 설명 중 한가지는 입력해야 합니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
        NOT_MATCHED: '게시물의 작성자만 수정할 수 있습니다.',
      },
      DELETE_BAND_POST: {
        SUCCEED: '밴드 게시물 삭제에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
        NOT_MATCHED: '게시물의 작성자만 삭제할 수 있습니다.',
      },
      Like_BAND_POST: {
        SUCCEED: '밴드 게시물 좋아요에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
        CONFLICT: '이미 좋아요 누른 게시물입니다.',
        TRANSACTION_ERROR: '게시물 좋아요 등록 중 오류가 생겼습니다.',
      },
      UNLIKE_BAND_POST: {
        SUCCEED: '밴드 게시물 좋아요 취소에 성공하였습니다.',
        BAD_REQUEST: '좋아요 수는 0 이하로 내려갈 수 없습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
        NOT_FOUND_Like: '좋아요 누르지 않은 밴드 게시물입니다.',
        TRANSACTION_ERROR: '게시물 좋아요 등록중 오류가 생겼습니다.',
      },
    },
    BAND_COMMENT: {
      CREATE_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 생성에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
      },
      GET_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 조회에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_POST: '존재하지 않는 밴드 게시물입니다.',
      },
      UPDATE_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 수정에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_Comment: '존재하지 않는 댓글입니다.',
        NOT_MATCHED: '댓글 작성자만 수정할 수 있습니다.',
      },
      DELETE_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 삭제에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_Comment: '존재하지 않는 댓글입니다.',
        NOT_MATCHED: '댓글 작성자만 수정할 수 있습니다.',
      },
      Like_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 좋아요에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_Comment: '존재하지 않는 댓글입니다.',
        CONFLICT: '이미 좋아요 누른 댓글입니다.',
        TRANSACTION_ERROR: '댓글 좋아요 등록중 오류가 생겼습니다.',
      },
      UNLIKE_BAND_COMMENT: {
        SUCCEED: '밴드 댓글 좋아요 취소에 성공하였습니다.',
        NOT_FOUND_USER: '밴드 멤버가 아닙니다.',
        NOT_FOUND_Comment: '존재하지 않는 댓글입니다.',
        NOT_FOUND_Like: '좋아요 누르지 않은 밴드 댓글입니다.',
        TRANSACTION_ERROR: '댓글 좋아요 등록중 오류가 생겼습니다.',
        BAD_REQUEST: '좋아요 수는 0 이하로 내려갈 수 없습니다.',
      },
    },
    COMMON: {
      BAND_ENTITY: {
        UID: {
          REQUIRED: '밴드 UID를 입력해 주세요',
        },
        USER_UID: {
          REQUIRED: '유저 UID를 입력해 주세요',
        },
        NAME: {
          REQUIRED: '밴드명을 입력해 주세요',
        },
        CONTENT: {
          REQUIRED: '밴드 설명을 입력해 주세요',
        },
      },
      BAND_POSTS_ENTITY: {
        UID: {
          REQUIRED: '밴드 게시글 UID를 입력해 주세요',
        },
        TITLE: {
          REQUIRED: '제목을 입력해 주세요',
        },
        CONTENT: {
          REQUIRED: '밴드 게시글 내용을 입력해 주세요',
        },
      },
      BAND_POSTS_COMMENTS_ENTITY: {
        UID: {
          REQUIRED: '밴드 댓글 UID를 입력해 주세요',
        },
        CONTENT: {
          REQUIRED: '밴드 댓글 내용을 입력해 주세요',
        },
      },
    },
  },
  PAYMENT: {
    PAYMENT_CART: {
      ADD_CART: {
        SUCCESS: '장바구니 추가에 성공하였습니다.',
        NOT_FOUND: '해당 수업은 존재하지 않습니다.',
        BEFORE_RECRUITMENT: '모집기간 전인 수업입니다.',
        AFTER_RECRUITMENT: '모집기간이 지난 수업입니다.',
        CONFLICT: '이미 장바구니에 있는 수업입니다.',
      },
      GET_CART_LIST: {
        SUCCESS: '장바구니 목록 조회에 성공하였습니다.',
      },
      DELETE_CART: {
        SUCCESS: '장바구니 삭제에 성공하였습니다.',
        NOT_FOUND: '비울 수 없는 물품입니다.',
      },
    },
    COMMON: {
      PAYMENT_CART_ENTITY: {
        BATCH_UID: '기수 UID를 입력해 주세요',
        CART_UID: '장바구니 UID를 입력해 주세요',
      },
    },
  },
  USER: {
    CONTROLLER: {
      FIND_ME: '내 정보 조회에 성공했습니다.',
      UPDATE_USER: '내 정보 수정에 성공했습니다.',
      FIND_MY_LESSONS: '내 강의 목록 조회에 성공했습니다.',
    },
    SERVICE: {
      NOT_FOUND_USER: '유저를 찾을 수 없습니다.',
      NOT_MATCHED_CURRENT_PASSWORD: '현재 비밀번호와 일치하지 않습니다.',
      NOT_MATCHED_CHANGE_CAPASSWORD: '변경하려는 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      EXISTED_NICKNAME: '중복되는 닉네임이 존재합니다.',
      NOT_FOUND_USER_LESSON: '수강중인 강의를 찾을 수 없습니다.',
    },
  },
  BATCH: {
    CONTROLLER: {
      CREATE: '기수 생성에 성공했습니다.',
      FINDALL: '기수 목록 찾기에 성공했습니다.',
      FINDONE: '기수 목록 상세 조회에 성공했습니다.',
      UPDATE: '기수 업데이트에 성공했습니다.',
      DELETE: '기수 삭제에 성공했습니다.',
    },
    SERVICE: {
      FIND: '강의를 찾을 수 없습니다.',
      NOT_EXISTING_BATCH: '존재하는 기수가 없습니다.',
      NOT_AUTHORIZED_LESSON: '해당 기업은 강의에 대한 권한이 없습니다.',
      EXISTING_BATCH: '이미 있는 기수입니다.',
    },
  },
  BATCH_NOTICE: {
    CONTROLLER: {
      CREATE: '기수 공지 생성에 성공했습니다.',
      FINDALL: '기수 공지 목록 찾기에 성공했습니다.',
      UPDATE: '기수 공지 업데이트에 성공했습니다.',
      DELETE: '기수 공지 삭제에 성공했습니다.',
    },
  },
}
