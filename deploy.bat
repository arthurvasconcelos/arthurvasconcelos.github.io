@echo ==== STARTING ====
@echo.

@IF EXIST .\dist\ (
    @echo ^=^=^> Remove dist folder:
    @RMDIR /S .\dist
)
@REM ) ELSE (
@REM )

@echo.
@echo ^=^=^> Building app:
@call npm run build

@echo.
@echo ^=^=^> Copying not scanned files:
XCOPY /v .\CNAME .\dist
XCOPY /v .\LICENSE .\dist
XCOPY /v .\README.md .\dist
XCOPY /v .\Makefile .\dist
XCOPY /v .\deploy.bat .\dist

@echo.
@echo ^=^=^> Checkout master branch:
@call git checkout master

@echo.
@echo ^=^=^> Apply dist and clean unwanted files and folders:
XCOPY /s /v /h /y .\dist\* .\
@RMDIR /S /Q .\dist

@echo.
@echo ^=^=^> Commit changes to master:
@call git add .
@call git commit -m ":rocket: deploy website"
@call git push origin master

@echo.
@echo ^=^=^> Go back to develop:
@call git checkout develop