import { heroes } from '../data/heroes.js';



export const findHeroById = (id:number)  =>{
    return heroes.find ((hero: { id: number; }) => hero.id === id);
}