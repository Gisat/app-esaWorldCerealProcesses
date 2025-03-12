"use client"

import React, { useEffect, useState } from 'react';
import "./style.css"
import useSWR from 'swr';
import { fetcher } from '@features/(shared)/_logic/utils';

export const InstanceWarn: React.FC<any> = () => {

    const instanceWarnUrl = '/api/instance-warning';
    const { data, isLoading } = useSWR(instanceWarnUrl, fetcher)

    const [closed, setClosed] = useState<boolean>(true);

    useEffect(() => {

        if (isLoading) {
            return;
        }

        if (data) {
            const { hidden } = data;
            setClosed(hidden);
        }
    }, [data])


    if (isLoading) {
        return null;
    }

    console.log(data);

    return closed ? null : (
        <div className='crl-instance-warn-wrap' >

            <div className='crl-instance-warn-text' style={{ backgroundColor: data.color ?? 'gray' }}>
                {data.text || 'DEV version'}
                <button
                    onClick={() => setClosed(true)}
                    className='crl-instance-warn-close'
                >
                    I understand
                </button>
            </div>
        </div>
    );
};