import { toast } from "react-toastify";
import { logOut } from "./actions/authAction";

export const apiStatus = (type, payload={}) => {
    const action = {
      type: type,
      payload: payload
    };
    return action;
  };

export const errorInterceptor = (error) => {
    console.log('errorss', error);
    if (typeof error === 'string' || error instanceof String) {
        toast.error(`${error}`)
    }
    if (error.response) {
        if(error.response.status === 500) {
            toast.error('Something went wrong.')
        } else {
            // Request made and server responded
            if (typeof error.response.data === 'string' || error.response.data instanceof String) {
                if(error.response.status === 403) {
                    toast.error(`Unauthorized`)
                } else {
                    toast.error(`${error.response.data}`)
                }
            } else {
                if(error.response.status !== 404) {
                    if(window && window.location.pathname.includes('/login') && error.response.status === 403) {
                        return
                    } else {
                        toast.error(`${error.response.data?.message}`)
                    }
                }
            }
            console.log('error.response.data', error.response.data);
            console.log('error.response.status', error.response.status);
            console.log('error.response.headers', error.response.headers);
            if(error.response.status === 401 || error.response.status === 403) {
                if(window) {
                    window.dispatchEvent(new CustomEvent('TasLogout', {detail: {unauthorised: true}}));
                }
            }
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.log('error.request', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        toast.error(error.message)
    }
}

export const getLocalStorageKey = (keyName) => {
    return localStorage.getItem(keyName);
}

export const statusFound = (status, includeFailed=false, includeError=false) => {
    let arr = ['pending', 'running', 'initiating']
    if(includeFailed) {
        arr = [...arr, 'failed']
    }
    if(includeError) {
        arr = [...arr, 'error']
    }
    return arr.includes(status);
}

export const StatusToPlaceholderText = {
    'pending': 'Running',
    'running': 'Running',
    'initiating': 'Queued',
}

export const testStatusFound = (status) => {
    let arr = ['completed', 'passed', 'failed', 'error', 'aborted', 'stopped', 'skipped', 'blacklisted', 'blocklisted', 'quarantined', 'running', 'pending', 'initiating']
    return arr.includes(status);
}

export const per_page_limit = 50;
export const search_char_limit = 2;