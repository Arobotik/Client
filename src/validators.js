import Cookies from "js-cookie";

export async function validateNewLoginData(state, loginChanged){
    let res = 0;
    if (loginChanged) {
        const response = await fetch('/api/validate/' + Cookies.get('login'));
        const body = await response.json();
        res = body.result ? 0 : 4;
    }
    let passValidate = /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/;
    let loginValidate = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
    if (!passValidate.test(Cookies.get('password'))){
        return 1;
    }
    if (Cookies.get('password').length > 16 || Cookies.get('password').length < 8){
        return 2;
    }
    if (!loginValidate.test(Cookies.get('login').toLowerCase()) || Cookies.get('login').length > 25) {
        return 3;
    }
    return res;
}

export async function validateNewUserData(state){
    // eslint-disable-next-line
    let phoneValidate = /^((\+?7|8)[\-]?)?((\(\d{3}\))|(\d{3}))?([\-])?(\d{3}[\-]?\d{2}[\-]?\d{2})$/;
    if (state.name.length === 0){
        return 1;
    }
    if (!phoneValidate.test(state.workPhone)){
        return 2;
    }
    if (!phoneValidate.test(state.privatePhone1)){
        return 3;
    }
    if ((state.privatePhone2 !== undefined &&
        state.privatePhone2 !== null &&
        state.privatePhone2 !== '' &&
        !phoneValidate.test(state.privatePhone2)) ||
        (state.privatePhone3 !== undefined &&
            state.privatePhone2 !== null &&
            state.privatePhone3 !== '' &&
            !phoneValidate.test(state.privatePhone3))){
        return 4;
    }
    if (!validateDate(state.birthDate)){
        return 5;
    }
    return 0;
}

function validateDate (value)
{
    let arrD = value.split(value.includes('.') ? '.' : '-');
    arrD[1] -= 1;
    let d = new Date(arrD[0], arrD[1], arrD[2]);

    return (d.getFullYear() === Number(arrD[0])) &&
        (d.getMonth() === Number(arrD[1])) &&
        (d.getDate() === Number(arrD[2]));
}

export async function validateConnection(){
    const response = await fetch('/api/checkSession/' + Cookies.get('sessionId'));
    const body = await response.json();
    if (!body.logged)
        window.location.assign('http://localhost:3000/app/login');
}

export async function validateAdminConnection(){
    const response = await fetch('/api/checkAdminSession/' + Cookies.get('sessionId'));

    const body = await response.json();
    if (!body.logged)
        window.location.assign('http://localhost:3000/admin/login');
}