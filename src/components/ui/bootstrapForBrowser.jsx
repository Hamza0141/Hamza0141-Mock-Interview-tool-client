import { useEffect } from 'react';

// bootstrap
const BootstrapForBrowser = () => {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min')
    }, []);
    return null
}

export default BootstrapForBrowser