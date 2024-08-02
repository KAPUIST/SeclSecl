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
    ORDER: {
      PURCHASE_ITEM: {
        SUCCESS: '주문 결제에 성공하였습니다.',
        NOT_FOUND_ORDER: '존재하지 않거나 완료 처리된 주문 정보 입니다.',
        CONFLICT_PRICE: '주문 금액과 결제 금액이 같지 않습니다.',
        TRANSACTION_ERROR: '결제 진행중 오류가 생겼습니다.',
      },
      REFUND_PAYMENT: {
        SUCCESS: '주문 환불에 성공하였습니다.',
        BAD_REQUEST: '잘못된 환불 요청입니다.',
        TRANSACTION_ERROR: '환불 진행중 오류가 생겼습니다.',
        NOT_MATCHED_USER: '환불할 결제 기록에 해당하는 유저가 아닙니다.',
        NOT_FOUND: '해당 결제정보와 연결된 주문 정보가 없습니다.',
        NOT_FOUND_PAYMENT: '해당 결제 정보가 존재하지 않습니다',
        REFUND_TIME_EXPIRED: '환불은 수업 시작 24시간 전에만 가능합니다',
      },
      CREATE_ORDER: {
        SUCCESS: '주문 결제에 성공하였습니다.',
        NOT_FOUND: '해당 수업은 존재하지 않습니다.',
        EXIST_ORDER: '해당 주문 번호에 이미 결제 대기중인 강의가 있습니다.',
        CONFLICT_LESSON: '이미 보유한 강의입니다.',
        BEFORE_RECRUITMENT: '모집기간 전인 수업입니다.',
        AFTER_RECRUITMENT: '모집기간이 지난 수업입니다.',
        TRANSACTION_ERROR: '주문 생성 중 오류가 생겼습니다.',
      },
      GET_PAYMENT_LIST: {
        SUCCESS: '결제 목록 조회에 성공하였습니다.',
      },
      GET_PAYMENT_DETAIL: {
        SUCCESS: '결제 상세 조회에 성공하였습니다.',
        NOT_MATCHED_USER: '해당 정보를 결제한 유저가 아닙니다.',
        NOT_FOUND: '해당 결제 정보는 존재하지 않습니다.',
      },
    },
    PAYMENT_CART: {
      ADD_CART: {
        SUCCESS: '장바구니 추가에 성공하였습니다.',
        NOT_FOUND: '해당 수업은 존재하지 않습니다.',
        BEFORE_RECRUITMENT: '모집기간 전인 수업입니다.',
        AFTER_RECRUITMENT: '모집기간이 지난 수업입니다.',
        CONFLICT_CART: '이미 장바구니에 있는 수업입니다.',
        CONFLICT_LESSON: '이미 보유한 강의입니다.',
        TRANSACTION_ERROR: '장바구니 추가 중 오류가 생겼습니다.',
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
      PAYMENT_ENTITY: {
        PAYMENT_UID: '결제 UID를 입력해 주세요',
      },
      PAYMENT_DETAIL: {
        UID: '결제 상세 UID를 입력해 주세요',
      },
      PAYMENT_TOSS: {
        PAYMENT_KEY: '결제키를 입력해 주세요',
        ORDER_ID: '주문 ID를 입력해 주세요',
        AMOUNT: '총 금액을 입력해 주세요',
      },
    },
  },
  USER: {
    CONTROLLER: {
      FIND_ME: '내 정보 조회에 성공했습니다.',
      UPDATE_USER: '내 정보 수정에 성공했습니다.',
      FIND_MY_LESSONS: '내 강의 목록 조회에 성공했습니다.',
      FIND_MY_LESSON_DETAIL: '내 강의 상세 조회에 성공했습니다.',
    },
    SERVICE: {
      NOT_FOUND_USER: '유저를 찾을 수 없습니다.',
      NOT_MATCHED_CURRENT_PASSWORD: '현재 비밀번호와 일치하지 않습니다.',
      NOT_MATCHED_CHANGE_PASSWORD: '변경하려는 비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      EXISTED_NICKNAME: '중복되는 닉네임이 존재합니다.',
      NOT_FOUND_USER_LESSON: '수강중인 강의를 찾을 수 없습니다.',
      NOT_FOUND_USER_LESSON_DETAIL: '해당 강의를 수강중이지 않습니다.',
    },
    FAVORITE: {
      ADD_FAVORITE: '강의를 찜했습니다.',
      DELETE_FAVORITE: '찜하기가 취소되었습니다.',
      NOT_FOUND_LESSON: '강의를 찾을수 없습니다.',
      FAILED: '강의 찜하기를 실패했습니다.',
      FIND_FAVORITE: '찜한목록 조회에 성공했습니다.',
    },
    COMMON: {
      USER_LESSON_ENTITY: {
        BATCH_UID: '기수 UID를 입력해 주세요',
      },
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
    SERVICE: {
      NOT_FIND_NOTICE: '기수 공지를 찾을 수 없습니다.',
      NOT_AUTHORIZED_NOTICE: '공지를 읽을 수 있는 권한이 없습니다.',
    },
  },
  BATCH_POST: {
    CONTROLLER: {
      CREATE: '기수 커뮤니티 생성에 성공했습니다.',
      FINDALL: '기수 커뮤니티 목록 찾기에 성공했습니다.',
      FINDONE: '기수 커뮤니티 상세 조회에 성공했습니다.',
      UPDATE: '기수 커뮤니티 업데이트에 성공했습니다.',
      DELETE: '기수 커뮤니티 삭제에 성공했습니다.',
      LIKE_BATCH_POST: {
        SUCCEED: '기수 커뮤니티 게시글 좋아요에 성공하였습니다.',
      },
      UNLIKE_BATCH_POST: {
        SUCCEED: '기수 커뮤니티 게시글 좋아요 취소에 성공하였습니다.',
      },
      CREATE_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 생성에 성공하였습니다.',
      },
      GET_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 조회에 성공하였습니다.',
      },
      UPDATE_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 수정에 성공하였습니다.',
      },
      DELETE_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 삭제에 성공하였습니다.',
      },
      LIKE_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 좋아요에 성공하였습니다.',
      },
      UNLIKE_BATCH_COMMENT: {
        SUCCEED: '기수 커뮤니티 댓글 좋아요 취소에 성공하였습니다.',
      },
    },
    SERVICE: {
      LIKE_BATCH_POST: {
        NOT_FOUND_USER: '기수 커뮤니티 멤버가 아닙니다.',
        NOT_FOUND_COMMENT: '존재하지 않는 게시글입니다.',
        CONFLICT: '이미 좋아요 누른 게시글입니다.',
        TRANSACTION_ERROR: '게시글 좋아요 등록중 오류가 생겼습니다.',
      },
      UNLIKE_BATCH_POST: {
        NOT_FOUND_USER: '기수 커뮤니티 멤버가 아닙니다.',
        NOT_FOUND_COMMENT: '존재하지 않는 게시입니다.',
        NOT_FOUND_Like: '좋아요 누르지 않은 밴드 게시글입니다.',
        TRANSACTION_ERROR: '게시글 좋아요 등록중 오류가 생겼습니다.',
        BAD_REQUEST: '좋아요 수는 0 이하로 내려갈 수 없습니다.',
      },
      CREATE_BATCH_COMMENT: {
        NOT_FOUND_POST: '존재하지 않는 기수 커뮤니티입니다.',
        NOT_FOUND_USER: '기수 멤버가 아닙니다.',
      },
      GET_BATCH_COMMENT: {
        NOT_FOUND_POST: '존재하지 않는 기수 커뮤니티입니다.',
        NOT_FOUND_USER: '기수 멤버가 아닙니다.',
      },
      UPDATE_BATCH_COMMENT: {
        NOT_FOUND_COMMENT: '존재하지 않는 댓글 입니다.',
        NOT_MATCHED: '댓글 작성자만 수정할 수 있습니다.',
      },
      DELETE_BATCH_COMMENT: {
        NOT_FOUND_COMMENT: '존재하지 않는 댓글입니다.',
        NOT_MATCHED: '댓글 작성자만 수정할 수 있습니다.',
      },
      LIKE_BATCH_COMMENT: {
        NOT_FOUND_USER: '기수 커뮤니티 멤버가 아닙니다.',
        NOT_FOUND_COMMENT: '존재하지 않는 댓글입니다.',
        CONFLICT: '이미 좋아요 누른 댓글입니다.',
        TRANSACTION_ERROR: '댓글 좋아요 등록중 오류가 생겼습니다.',
      },
      UNLIKE_BATCH_COMMENT: {
        NOT_FOUND_USER: '기수 커뮤니티 멤버가 아닙니다.',
        NOT_FOUND_COMMENT: '존재하지 않는 댓글입니다.',
        NOT_FOUND_Like: '좋아요 누르지 않은 밴드 댓글입니다.',
        TRANSACTION_ERROR: '댓글 좋아요 등록중 오류가 생겼습니다.',
        BAD_REQUEST: '좋아요 수는 0 이하로 내려갈 수 없습니다.',
      },
    },
    COMMON: {
      BATCH_POST_ENTITY: {
        UID: {
          REQUIRED: '기수 커뮤니티 UID를 입력해 주세요',
        },
        BATCH_UID: {
          REQUIRED: '기수 UID를 입력해 주세요',
        },
      },
      BAND_POSTS_COMMENTS_ENTITY: {
        UID: {
          REQUIRED: '기수 커뮤니티 댓글 UID를 입력해 주세요',
        },
        CONTENT: {
          REQUIRED: '기수 게시판 댓글 내용을 입력해 주세요',
        },
      },
    },
  },
}
