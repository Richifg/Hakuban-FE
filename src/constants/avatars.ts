import hippoIcon from '../assets/avatarIcons/hippo.png';
import koalaIcon from '../assets/avatarIcons/koala.png';
import leopardIcon from '../assets/avatarIcons/leopard.png';
import rhinoIcon from '../assets/avatarIcons/rhino.png';
import toucanIcon from '../assets/avatarIcons/toucan.png';
import zebraIcon from '../assets/avatarIcons/zebra.png';
import bearIcon from '../assets/avatarIcons/bear.png';
import elephantIcon from '../assets/avatarIcons/elephant.png';

// only icon name is sent through web socket
export const avatarIconsByName: { [key: string]: string } = {
    hippo: hippoIcon,
    koala: koalaIcon,
    leopard: leopardIcon,
    rhino: rhinoIcon,
    toucan: toucanIcon,
    zebra: zebraIcon,
    bear: bearIcon,
    elephant: elephantIcon,
};

export const avatarIcons = Object.entries(avatarIconsByName).map(([name, icon]) => ({ name, icon }));

// although color value is sent web socket, the name is required for default avatar names
export const avatarColorsValue: { [key: string]: string } = {
    '#FFB5E8': 'pink',
    '#D5AAFF': 'purple',
    '#85E3FF': 'blue',
    '#BFFCC6': 'green',
    '#FFFFD1 ': 'yellow',
    '#FFABAB': 'red',
};

export const avatarColors = Object.entries(avatarColorsValue).map(([color, name]) => ({ name, color }));
