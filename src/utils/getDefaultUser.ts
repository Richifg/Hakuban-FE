import { User } from '../interfaces';
import { userAnimals, userColors } from '../constants';
import seedRandom from 'seedrandom';

// user avatar options only exist on FE so a seeded random generator is used
// to determine the default user avatar before user makes any changes

function getDefaultUser(id: string): User {
    const rng = seedRandom(id);
    const animal = userAnimals[Math.floor(rng() * userAnimals.length)];
    const color = userColors[Math.floor(rng() * userColors.length)];
    const username = `Anonymous ${animal}`;
    return {
        id,
        username,
        color,
    };
}

export default getDefaultUser;
