REPOSITORY=/home/ubuntu/deploy-be # 배포된 프로젝트 경로.

cd $REPOSITORY # 이 경로로 이동해서 밑에 명령어들을 차례로 실행.

sudo npm install --legacy-peer-deps # 의존성 파일 설치.

# 기존 프로세스 종료
pm2 stop "seclsecl" && pm2 delete "seclsecl"

pm2 start dist/main.js --name "seclsecl"