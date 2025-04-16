import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookSection from '../book/BookSection'
import Recomendacion from '../book/Recomendation_week'
import CategoriasDestacadas from '../category/Categories'
import AlasOnix from '@/assets/img/portada_libro.jpg'
import RebeccaYarros from "@/assets/img/Rebecca_Yarros.jpg"
import { librosEjemplo } from '@/assets/data/example'

function HomePage() {
    const [count, setCount] = useState(0)
    const navigate = useNavigate();
    return (
        <>
            <Recomendacion
                imagenLibro={AlasOnix}
                imagenAutora={RebeccaYarros}
                tituloLibro="Alas de Onix"
                nombreAutora="Rebeca Yarros"
                onClick={() => navigate('/libro/alas-de-onix')}
            />

            <main className="flex-grow p-6">

                <BookSection tituloSeccion="Novedades" libros={librosEjemplo} />
                <BookSection tituloSeccion="Lo mas visto" libros={librosEjemplo} />
                <CategoriasDestacadas />
            </main>
        </>
    )
}

export { HomePage };
