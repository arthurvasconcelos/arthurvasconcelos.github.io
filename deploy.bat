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
XCOPY /v .\Makefile .\dist

@echo.
@echo ^=^=^> Checkout master branch:
@call git checkout master

@echo EVEN AFTER