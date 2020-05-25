import Cookies from "js-cookie";

export async function getBranches(asc = true){
    const response = await fetch('/api/branches/' + asc);
    return await response.json();
}

export async function getRequests(sessionId){
    const response = await fetch('/api/requests/' + sessionId);
    return await response.json();
}

export async function getLastVisited(sessionId){
    const response = await fetch('/api/lastVisited/' + sessionId);
    return await response.json();
}

export async function getUser(sessionId, userId){
    const response = await fetch('/api/user/' + userId + '/' + sessionId);
    return await response.json();
}

export async function getAllPages(bookPageCurrent, filter, sortByAsc){
    const response = await fetch('/api/users/' + bookPageCurrent + '/filter' + filter + '/' + sortByAsc);
    return await response.json();
}

export async function getRequestAccess(sessionId, userId){
    const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({session: sessionId, requestedId: userId}),
    });
    return await response.json();
}

export async function getMyPage(sessionId){
    const response = await fetch('/api/me/' + sessionId + '/-1');
    return await response.json();
}

export async function setUpdatedUserData(state){
    const response = await fetch('/api/users', {
        method: 'POST',
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
            privatePhone2: state.privatePhone2,
            privatePhone3: state.privatePhone3,
            branch: state.branch,
            position: state.position,
            workPlace:state.workPlace,
            hideYear: state.hideYear,
            hidePhones: state.hidePhones,
            about: state.about,
            avatar: state.avatar,
            len: state.avatar.length,
            session: state.sessionId,
        }),
    });
    return await response.json();
}

export async function setNewUser(state){
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: Cookies.get('login'),
            password: Cookies.get('password'),
            name: state.name,
            birthDate: state.birthDate,
            workPhone: state.workPhone,
            privatePhone1: state.privatePhone1,
            privatePhone2: state.privatePhone2,
            privatePhone3: state.privatePhone3,
            branch: state.branch,
            position: state.position,
            workPlace: state.workPlace,
            hideYear: state.hideYear,
            hidePhones: state.hidePhones,
            about: state.about,
            avatar: state.avatar,
            len: state.avatar !== null ? state.avatar.length : 0,
        }),
    });
    return await response.json();
}

export async function setRequestStatus(sessionId, requesting, status){
    const response = await fetch('/api/requests/' + sessionId + '/' + requesting, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: status ? '1' : '-1'})
    });
    return await response.json();
}

export async function login(login, password){
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({login: login, password: password}),
    });
    return await response.json();
}