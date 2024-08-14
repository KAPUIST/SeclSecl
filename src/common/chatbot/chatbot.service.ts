import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

@Injectable()
export class ChatbotService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // 환경 변수에 API 키를 설정하세요
    })
  }

  async getResponse(userResponse: string): Promise<{ text: string; options: string[] }> {
    let responseText = ''
    let options: string[] = []

    // 긍정적인 키워드 목록
    const positiveKeywords = [
      '1:1',
      '채팅문의',
      '채팅 문의',
      '결제',
      '수단',
      '방법',
      '가격',
      '같은 강의',
      '한번 더',
      '하루수업',
      '회원가입',
      '계정 만들기',
      '회원 등록',
      '비밀번호 재설정',
      '비밀번호 변경',
      '비번 잊어버렸어요',
      '환불',
      '결제 취소',
      '환불 요청',
      '수강 기간',
      '강의 기간',
      '수업 기간',
      '공지사항',
      '업데이트',
      '새로운 소식',
      '도움말',
      '도움이 필요해요',
      '도와주세요',
      '강의 추천',
      '어떤 강의를 들어야 할까요?',
      '추천 강의',
      '기술 지원',
      '문제 발생',
      '에러',
      '사랑방',
      '채팅방',
      '누가',
      '설명',
      '서비스',
      '어떤',
    ]

    // 부정적인 또는 비정상적인 키워드 목록
    const negativeKeywords = ['별로', '안좋다', '싫다', '문제있다', '불만', '부정적', '최악', '못해']

    // 사용자 응답에 따라 처리
    if (negativeKeywords.some((keyword) => userResponse.includes(keyword))) {
      responseText = '죄송합니다, 요청하신 내용에 대한 정보를 제공할 수 없습니다.'
    } else if (positiveKeywords.some((keyword) => userResponse.includes(keyword))) {
      // 예상 응답을 포함한 프롬프트
      const aiResponse = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
            당신은 "시클시클" 노인 강의 서비스에 고객응답을 담당하는 친절한 챗봇입니다. 
            이 프로젝트는 은퇴자나 노인의 사회 복귀, 또는 커뮤니티 형성을 쉽게 해주기 위해 만든 서비스입니다.
            내일배움 캠프 (Node.js_5기) 1조 "시클시클" 에서 만들었고, 
            1조 멤버는 팀장 "손태권"님, 부팀장 "채유일"님, 팀원 "모전하"님, "김예원"님, "조규민"님이 참여했습니다.
            팀 노션은 "https://teamsparta.notion.site/3bb1c623b9a14d9f80f83a3c3e6dee25"에서 확인할 수 있습니다.
            가능한 짧게 답변해주세요.
            
            다음의 질문에 대한 예상 응답을 참고하여 답변을 제공합니다:

            - 키워드: "회원가입", "계정 만들기", "회원 등록"을 물어보면 -> 예상 응답: "회원가입을 하시려면 시클시클 웹사이트나 앱에서 '회원가입' 버튼을 클릭하고, 필요한 정보를 입력하시면 됩니다. 간단한 절차로 계정을 만들 수 있습니다."
            - 키워드: "환불", "결제 취소", "환불 요청"을 물어보면 -> 예상 응답: "'결제 목록' 페이지에서 환불 신청을 하실 수 있습니다. 환불 정책은 각 강의마다 다를 수 있으니, 확인 부탁드립니다."
            - 키워드: "수강 기간", "강의 기간", "수업 기간"을 물어보면 -> 예상 응답: "강의의 수강 기간은 강의 상세 페이지에서 확인하실 수 있습니다."
            - 키워드: "사랑방"이나 "채팅방"을 물어보면 -> 예상 응답: "사이트 상단에 다양한 사랑방을 통해 다른 분들과의 채팅 서비스를 사용하실 수 있습니다. 가입하고 싶은 사랑방을 클릭만 하시면 가입하실 수 있습니다."
            - "1:1 문의 채팅은 어디서 해?" -> 예상 응답: "강의 상세정보에서 1:1 채팅 문의를 통해 문의해 보실 수 있습니다."
            - "결제 방법은?" -> 예상 응답: "결제 수단으로는 간편결제, 신용카드, 그리고 온라인 결제가 가능합니다."
            - "하루수업이 뭐에요?" -> 예상 응답: "아직 하루수업은 준비되지 않은 서비스입니다. 최대한 빠른 시일 내에 서비스하겠습니다."
            
            사용자가 질문하는 내용에 맞춰 이러한 예시를 참고하여 답변을 제공합니다.
            `,
          },
          { role: 'user', content: userResponse },
        ],
        max_tokens: 200,
        temperature: 0.7,
      })

      responseText = aiResponse.choices[0].message.content.trim()
    } else {
      // 원하는 조건에 맞지 않는 경우 기본 응답 반환
      responseText = '죄송합니다, 요청하신 내용에 대한 정보를 제공할 수 없습니다.'
    }

    return { text: responseText, options }
  }
}
