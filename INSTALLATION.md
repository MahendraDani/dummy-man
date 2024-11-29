# Guide for Slef Hosting Snipy AI
This guide explains all the steps required to setup the project locally and self host using your own [Hypermode](https://hypermode.com/) account.

1. Fork and clone this repository on your computer
```bash
git clone https://github.com/<username>/snipy/
```

2. Install all the dependencies and modus cli by following the [official docs](https://docs.hypermode.com/modus/overview).
```
cd extension && npm install
```

3. Create a new project on your [Hypermode](https://hypermode.com/) account and obtain the `API_ENDPOINT` and `API_KEY`.

4. Create a new file `extension/.env` and paste the environment variables
```
WXT_API_KEY=<API_KEY>
WXT_DEV_BASE_API=http://localhost:8686/graphql
WXT_PROD_BASE_API=<API_ENDPOINT>
```

5. Execute `modus dev` to run the API in terminal.
6. In another terminal change into `/extension` directory to run the extension : 
```bash
npm run dev
```

If both the services start, you have successfully self hosted the extension!