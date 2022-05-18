import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector, useDispatch } from '../../../hooks';
import { setShowAvatarMenu } from '../../../store/slices/UISlice';
import { setOwnUser } from '../../../store/slices/usersSlice';
import { avatarColors, avatarIcons } from '../../../constants';
import { WSService } from '../../../services';

import './AvatarMenu.scss';

const AvatarMenu = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { showAvatarMenu } = useSelector((s) => s.UI);
    const { ownUser } = useSelector((s) => s.users);
    const [hasModified, setHasModified] = useState(false);
    const [username, setUsername] = useState('');
    const [color, setColor] = useState('');
    const [icon, setIcon] = useState('');

    // sets default values when openning menu
    useLayoutEffect(() => {
        if (showAvatarMenu) {
            setHasModified(false);
            setUsername(ownUser?.username || '');
            setColor(ownUser?.color || '');
            setIcon(ownUser?.icon || '');
        }
    }, [showAvatarMenu, ownUser]);

    // checks if any modifications have been made to the inputs
    useEffect(() => {
        if (showAvatarMenu) setHasModified(true);
    }, [username, color, icon, showAvatarMenu]);

    // updates ownUser if saving
    const handleClose = (shouldSave: boolean) => {
        if (shouldSave && ownUser) {
            const newUser = { ...ownUser, username, color, icon };
            dispatch(setOwnUser(newUser));
            WSService.updateUser(newUser);
        }
        dispatch(setShowAvatarMenu(false));
    };

    if (!showAvatarMenu) return <></>;
    return (
        <div className="avatar-menu">
            <label>
                Username
                <input type="text" value={username} onChange={({ currentTarget }) => setUsername(currentTarget.value)} />
            </label>
            <label>
                Avatar Icon
                <span className="options-container">
                    {avatarIcons.map((avatarIcon) => (
                        <button
                            className="option"
                            key={avatarIcon}
                            disabled={icon === avatarIcon}
                            onClick={() => setIcon(avatarIcon)}
                        >
                            {avatarIcon}
                        </button>
                    ))}
                </span>
            </label>
            <label>
                Avatar Color
                <span className="options-container">
                    {avatarColors.map((avatarColor) => (
                        <button
                            className="option"
                            key={avatarColor}
                            disabled={color === avatarColor}
                            onClick={() => setColor(avatarColor)}
                        >
                            {avatarColor}
                        </button>
                    ))}
                </span>
            </label>
            <button onClick={() => handleClose(false)}>cancel</button>
            <button disabled={!hasModified} onClick={() => handleClose(true)}>
                Save
            </button>
        </div>
    );
};

export default AvatarMenu;
