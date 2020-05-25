import Cookies from "js-cookie";

export async function login(){
    const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: Cookies.get('login'), password: Cookies.get('password') }),
    });
    return await response.json();
}

export async function getAllPages(bookPageCurrent, filter, deleted, sortByAsc){
    const response = await fetch('/admin/users/' + Cookies.get('sessionId') + '/' + bookPageCurrent + '/filter' + filter + '/' + deleted + '/' + sortByAsc);
    return await response.json();
}

export async function getUserData(id){
    const response = await fetch('/api/me/' + Cookies.get('sessionId') + '/' + id);
    return await response.json();
}

export async function getAllRequests(page, asc, status){
    const response = await fetch('/admin/requests/' + Cookies.get('sessionId') + '/' + page + '/' + asc + '/status' + status);
    return await response.json();
}

export async function setAdminRequest(target, requesting, status){
    const response = await fetch('/admin/requests/' + Cookies.get('sessionId'), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            target: target,
            requesting: requesting,
            status: status,
        }),
    });
    return await response.json();
}

export async function setBranchesUpdate(branches){
    const response = await  fetch('/admin/branches', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            branches: branches,
            session: Cookies.get('sessionId'),
        }),
    });
    return await response.json();
}

export async function setUserDataUpdate(state, avatar){
    return await fetch('/admin/users/' + Cookies.get('sessionId'), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: state.login.toLowerCase(),
            password: state.password,
            name: state.name,
            birthDate: state.birthDate,
            workPhone: state.workPhone,
            privatePhone1: state.privatePhone1,
            privatePhone2: state.privatePhone1,
            privatePhone3: state.privatePhone1,
            branch: state.branch,
            position: state.position,
            workPlace: state.workPlace,
            hideYear: state.hideYear,
            hidePhones: state.hidePhones,
            about: state.about,
            avatar: avatar,
            len: avatar !== null ? avatar.length : 0,
            id: state.id,
        })
    })
}

export async function deleteUser(id, deleted){
    return await fetch('/api/deleteUser/' + id + '/' + deleted, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session: Cookies.get('sessionId'),
        })
    })
}