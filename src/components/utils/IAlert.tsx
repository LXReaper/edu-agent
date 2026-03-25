import React from 'react';
import {Alert} from "antd";
import type {IAlertProps} from "../../type";

export const IAlert: React.FC<IAlertProps> = ({
    message,
    description,
    showIcon = true,
    banner= false,
    type = 'info', // 默认类型为 info
    ...restProps
}) => {
    return (
        <Alert
            message={message}
            description={description}
            type={type}
            banner={banner}
            showIcon={showIcon}
            {...restProps}
        />
    );
};
