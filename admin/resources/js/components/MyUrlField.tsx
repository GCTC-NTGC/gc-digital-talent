import * as React from "react";
import { FieldProps, useRecordContext } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles({
    link: {
        textDecoration: 'none',
    },
    icon: {
        width: '0.5em',
        height: '0.5em',
        paddingLeft: 2,
    },
});

const MyUrlField = ({ source }: FieldProps): React.ReactElement | null => {
    const record = useRecordContext();
    const classes = useStyles();
    return record && source ? (
        <a href={record[source]} className={classes.link}>
            {record[source]}
            <LaunchIcon className={classes.icon} />
        </a>
    ) : null;
}

export default MyUrlField;
