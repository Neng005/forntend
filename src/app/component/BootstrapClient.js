"use client"

import {useEffect}  from 'react';

function BootstrapClient(){
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);
}

export default BootstrapClient;