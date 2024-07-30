REPOSITORY=/home/ubuntu/deploy-be # 배포된 프로젝트 경로.

cd $REPOSITORY # 이 경로로 이동해서 밑에 명령어들을 차례로 실행.

# 기존 프로세스 종료
/home/ubuntu/.nvm/versions/node/v20.15.1/bin/pm2 stop "seclsecl" && /home/ubuntu/.nvm/versions/node/v20.15.1/bin/pm2 delete "seclsecl"

# 새로 시작
/home/ubuntu/.nvm/versions/node/v20.15.1/bin/pm2 start dist/main.js --name "seclsecl"