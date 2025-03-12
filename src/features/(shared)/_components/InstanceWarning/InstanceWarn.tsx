"use client"

import React, { useEffect, useState } from 'react';
import "./style.css"
import useSWR from 'swr';
import { fetcher } from '@features/(shared)/_logic/utils';

/**
 * A React component that displays an instance warning message.
 * The warning is fetched from '/api/instance-warning' endpoint and can be dismissed by the user.
 * 
 */
export const InstanceWarn: React.FC = () => {

    // call API route for envs
    const instanceWarnUrl = '/api/instance-warning';
    const { data, isLoading } = useSWR(instanceWarnUrl, fetcher)

    // set state for closed
    const [closed, setClosed] = useState<boolean>(true);

    // set closed state based on fetched
    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (data) {
            const { hidden } = data;
            setClosed(hidden);
        }
    }, [data, isLoading]) // Added isLoading to dependency array to ensure effect runs correctly

    // return null if loading
    if (isLoading) {
        return null;
    }

    // return null if closed or render warning line
    return closed ? null : (
        <div className='crl-instance-warn-wrap'>
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