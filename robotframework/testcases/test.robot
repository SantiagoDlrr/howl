*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BASE_URL}    http://localhost:3000  # Change this to your actual dev server

*** Test Cases ***
Render Login Card When Mode Is Login
    Open Browser    ${BASE_URL}/auth?mode=login    Chrome
    Element Should Be Visible    css:[data-testid="login-card"]
    [Teardown]    Close Browser

Render Signup Card When Mode Is Signup
    Open Browser    ${BASE_URL}/auth?mode=signup    Chrome
    Element Should Be Visible    css:[data-testid="signup-card"]
    [Teardown]    Close Browser