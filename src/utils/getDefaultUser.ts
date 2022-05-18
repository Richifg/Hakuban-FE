import { User } from '../interfaces';
import { avatarColors, avatarIcons } from '../constants';
import seedRandom from 'seedrandom';

// user avatar options only exist on FE so a seeded random generator is used
// to determine the default user avatar before user makes any changes

function getDefaultUser(id: string): User {
    const rng = seedRandom(id);
    const color = avatarColors[Math.floor(rng() * avatarColors.length)];
    const icon = avatarIcons[Math.floor(rng() * avatarIcons.length)];
    const username = `${color} ${icon}`;
    return {
        id,
        username,
        color,
        icon,
    };
}

export default getDefaultUser;
