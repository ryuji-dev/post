# # 1. Node.js 기반 이미지 설정
# FROM node:22

# # 2. 작업 디렉토리 생성 및 이동
# WORKDIR /usr/src/app

# # 3. package.json 및 package-lock.json 복사
# COPY package*.json ./

# # 4. 패키지 설치
# RUN npm install

# # 5. nest-cli 글로벌 설치
# RUN npm install -g @nestjs/cli

# # 6. 글로벌 npm bin 디렉토리를 PATH에 추가
# ENV PATH=/usr/local/lib/node_modules/.bin:$PATH

# # 7. 소스 코드 복사
# COPY . .

# # 8. NestJS 앱 빌드
# RUN npm run build

# # 9. 실행할 포트 지정
# EXPOSE 3000

# # 10. 컨테이너 실행 명령 (마이그레이션 적용 후 앱 실행)
# CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]

FROM node:22

WORKDIR /usr/src/app

# package.json과 package-lock.json을 복사합니다.
COPY package*.json ./

# 컨테이너 내에서 npm install을 실행합니다.
RUN npm install

# 나머지 소스 코드를 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 애플리케이션을 시작합니다.
CMD ["npm", "run", "start:prod"]