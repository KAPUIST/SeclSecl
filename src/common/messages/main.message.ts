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
      PHONE_VERIFICATION_FAILED: '전화번호 인증 확인 중 오류가 발생했습니다.',
      PASSWORD_PROCESSING_FAILED: '비밀번호 처리 중 오류가 발생했습니다.',
      PASSWORD_VERIFICATION_FAILED: '비밀번호 확인 중 오류가 발생했습니다.',
      USER_VALIDATION_FAILED: '사용자 인증 중 오류가 발생했습니다.',
      SIGNUP_FAILED: '회원가입 중 오류가 발생했습니다.',
      VERIFICATION_CODE_SEND_FAILED: '인증 코드 전송 중 오류가 발생했습니다.',
      CODE_VERIFICATION_FAILED: '코드 확인 중 오류가 발생했습니다.',
      SIGNIN_FAILED: '로그인 중 오류가 발생했습니다.',
      SIGNOUT_FAILED: '로그아웃 중 오류가 발생했습니다.',
      TOKEN_UPDATE_FAILED: '토큰 갱신 중 오류가 발생했습니다.',
      USER_DELETE_FAILED: '사용자 삭제 중 오류가 발생했습니다.',
      PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
      EMAIL_EXISTS: '이미 존재하는 이메일입니다.',
      NICKNAME_EXISTS: '이미 존재하는 닉네임입니다.',
      PHONE_NOT_VERIFIED: '인증되지 않은 전화번호입니다.',
      INVALID_REFRESH_TOKEN: '유효하지 않은 리프레시 토큰입니다.',
      USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
      PHONE_EXISTS: '이미 등록된 전화번호입니다.',
    },
  },
  LESSON: {
    FIND_ALL_LESSONS: '모든 레슨 조회 성공',
    FIND_ALL_LESSONS_FAILED: '모든 레슨 조회 실패',
    FIND_POPULAR_LESSONS: '인기 레슨 조회 성공',
    FIND_POPULAR_LESSON_FAILED: '인기 레슨 조회 실패',
    SEARCH_LESSON_SUCCESS: '레슨 검색 성공',
    SEARCH_LESSON_FAILED: '레슨 검색 실패',
    LESSON_NOT_FOUND: '레슨을 찾을 수 없습니다',
    FIND_LESSON_SUCCESS: '레슨 상세 조회 성공',
    FIND_LESSON_FAILED: '레슨 조회 실패',
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
        NOT_FOUND: '해당 결제정보와 상세 결제 정보가 없습니다.',
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
      CHECK_CART: {
        SUCCESS: '장바구니 체크에 성공하였습니다.',
      },
    },
    COMMON: {
      PAYMENT_CART_ENTITY: {
        BATCH_UID: '기수 UID를 입력해 주세요',
        CART_UID: '장바구니 UID를 입력해 주세요',
        USER_UID: '유저 UID를 입력해 주세요',
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
        ORDER_NAME: '주문명을 입력해 주세요',
        CURRENCY: '결제 화폐를 입력해 주세요',
        METHOD: '결제 방법을 입력해 주세요',
        AMOUNT: '총 금액을 입력해 주세요',
        TRANSACTION_KEY: '트랜잭션 키를 입력해 주세요',
        STATUS: '결제 상태를 입력해 주세요',
        VAT: '부가 가치세를 입력해 주세요',
        REQUESTED_AT: '요청 시각 입력해 주세요',
        APPROVED_AT: '승인 시각 입력해 주세요',
        BATCH_LIST: '장바구니 목록을 입력해 주세요',
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
      NOT_FOUND_USER: '사용자를 찾을 수 없습니다.',
      NOT_FOUND_PASSWORD: '현재 비밀번호를 입력해주세요.',
      NOT_FOUND_NEW_PASSWORD: '새 비밀번호를 입력해주세요.',
      NOT_FOUND_NEW_PASSWORD_CONFIRM: '새 비밀번호 확인을 입력해주세요.',
      NOT_MATCHED_CURRENT_PASSWORD: '현재 비밀번호가 일치하지 않습니다.',
      NOT_MATCHED_CHANGE_PASSWORD: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      EXISTED_NICKNAME: '이미 존재하는 닉네임입니다.',
      NOT_FOUND_USER_LESSON: '사용자의 강의를 찾을 수 없습니다.',
      NOT_FOUND_USER_LESSON_DETAIL: '해당 강의의 상세 정보를 찾을 수 없습니다.',
      USER_INFO_UPDATED: '사용자 정보가 성공적으로 업데이트되었습니다.',
      USER_INFO_FETCHED: '사용자 정보를 성공적으로 조회했습니다.',
      USER_LESSONS_FETCHED: '사용자의 강의 목록을 성공적으로 조회했습니다.',
      USER_LESSON_DETAIL_FETCHED: '강의 상세 정보를 성공적으로 조회했습니다.',
      USER_INFO_UPDATE_FAILED: '사용자 정보 업데이트 중 오류가 발생했습니다.',
      USER_INFO_FETCH_FAILED: '사용자 정보 조회 중 오류가 발생했습니다.',
      USER_LESSONS_FETCH_FAILED: '사용자 강의 목록 조회 중 오류가 발생했습니다.',
      USER_LESSON_DETAIL_FETCH_FAILED: '사용자 강의 상세 정보 조회 중 오류가 발생했습니다.',
    },
    FAVORITE: {
      ADD_FAVORITE: '강의를 찜 목록에 추가했습니다.',
      DELETE_FAVORITE: '강의를 찜 목록에서 제거했습니다.',
      NOT_FOUND_LESSON: '해당 강의를 찾을 수 없습니다.',
      FAILED: '찜하기 작업 중 오류가 발생했습니다.',
      FIND_FAVORITE: '찜 목록을 성공적으로 조회했습니다.',
      FAVORITE_FETCH_FAILED: '찜한 강의 목록을 가져오는데 실패했습니다.',
      TOGGLE_FAILED: '강의 찜하기 토글 중 오류가 발생했습니다.',
      REMOVE_FAILED: '강의 찜하기 삭제 중 오류가 발생했습니다.',
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
      NOT_AUTHORIZED_LESSON: '해당 강의에 대한 권한이 없습니다.',
      EXISTING_BATCH: '이미 있는 기수입니다.',
    },
    COMMON: {
      BATCH__ENTITY: {
        LESSON_UID: '강의 UID를 입력해 주세요',
        BATCH_UID: '기수 UID를 입력해 주세요',
      },
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
