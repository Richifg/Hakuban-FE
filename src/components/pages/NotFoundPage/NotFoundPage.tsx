import React from 'react';
import { useHistory } from 'react-router';
import { ErrorScreen } from '../../common';

import styles from './NotFoundPage.module.scss';

const NotFoundPage = (): React.ReactElement => {
    const history = useHistory();

    return (
        <div className={styles.notFoundPage}>
            <ErrorScreen
                title="404"
                text="Page not found"
                onClose={() => history.push('/')}
                onTryAgain={() => location.reload()}
            />
        </div>
    );
};

export default NotFoundPage;
