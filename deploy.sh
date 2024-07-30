REPOSITORY=/home/ubuntu/deploy-be # 배포된 프로젝트 경로.

cd $REPOSITORY || exit # 이 경로로 이동 실패 시 스크립트 종료

# NVM 및 Node.js 환경 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # NVM 로드
nvm use 20.15.1 # 사용할 Node.js 버전 설정


# 기존 프로세스 종료 (존재할 경우)
pm2 stop "seclsecl"
pm2 delete "seclsecl" 

# 새로 시작
pm2 start dist/main.js --name "seclsecl"