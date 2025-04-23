import { librosEjemplo } from '@/assets/data/example'
import { Favorites } from './FavoritesSection'

function Favoritos() {
    return(
        <>
        <Favorites libros={librosEjemplo} />
        </>
    )
    
}

export { Favoritos }
