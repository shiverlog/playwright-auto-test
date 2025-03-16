# Modularization (모듈화) (03/24 - 03/28)

- NPM : https://www.npmjs.com/

## common npm 모듈로 패키징

```
cd common
npm init -y
npm login
npm publish --access restricted
npm login --registry=https://npm.pkg.github.com
```

npx playwright test
npx playwright test tests-examples/demo-todo-app.spec.ts
npx playwright show-report
npx playwright test tests/example.spec.ts

```sh
# mosaic-db 사용을 위한 라이브러리 설치
sudo apt-get install cmake gcc-10 g++-10 libc++-dev libc++abi-dev \
    libnuma-dev libibverbs-dev libgflags-dev libgoogle-glog-dev liburing-dev
```

```powershell
# Chocolatey 설치
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

```powershell
# chocolatey를 사용하여 OpenCV 설치
choco install opencv -y
```
