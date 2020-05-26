import Cookies from "js-cookie";

export async function login(login, password){
    const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: login, password: password }),
    });
    return await response.json();
}

export async function getAllPages(sessionId, bookPageCurrent, filter, deleted, sortByAsc){
    const response = await fetch('/admin/users/' + sessionId + '/' + bookPageCurrent + '/filter' + filter + '/' + deleted + '/' + sortByAsc);
    return await response.json();
}

export async function getUserData(id){
    const response = await fetch('/api/me/' + Cookies.get('sessionId') + '/' + id);
    return await response.json();
}

export async function getAllRequests(sessionId, page, asc, status){
    const response = await fetch('/admin/requests/' + sessionId + '/' + page + '/' + asc + '/status' + status);
    return await response.json();
}

export async function setAdminRequest(sessionId, target, requesting, status){
    const response = await fetch('/admin/requests/' + sessionId, {
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

export async function setBranchesUpdate(sessionId, branches){
    const response = await  fetch('/admin/branches', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            branches: branches,
            session: sessionId,
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