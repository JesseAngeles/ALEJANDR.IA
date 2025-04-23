import AlasOnix from '@/assets/img/portada_libro.jpg'
import { BookDetails } from '../types/bookdetails'

export const infobook: BookDetails[] = [
    {
      imagen: AlasOnix,
      titulo: "UN FUEGO AZUL",
      autor: "PEDRO FEIJOO",
      precio: 1299,
      disponible: true,
      precioDescuento: 1000,
      sinopsis: `Pedro Feijoo ha escrito un libro frenetico, lleno de giros  sorprendentes y  con un ritmo que deja al lector sin aliento. Una  historia poblada por  personajes cargados de ira pero tambien de una extrema fragilidad. Una  novela negra, muy negra.
Existe una maldad excesiva, insufrible, grotesca. No deja grietas y  arrastra con ella toda posibilidad de  expiación, de perdón o de futuro.
El responsable de la Brigada de Investigación Criminal de la comisaría  central de Vigo todavía no lo  sabe, pero se enfrenta a ese tipo de maldad.
La escena del primer crimen le sorprende por el metodo y el ensañamiento  sobre la víctima.  Pero, al descubrir las siguientes, ya no le cabe  ninguna duda de que  detrás de estos macabros asesinatos hay alguien muy enfermo.
Y  cuando por fin tiene claro hacia dónde conducir la investigación, nada   será como el pensaba... sino mucho más violento y perturbador.`,
      enCarrito: false, // no puedes usar `carrito.includes(...)` aquí
      onAgregarAlCarrito: () => {},
      onEliminarDelCarrito: () => {},
      categoria: "Literatura juvenil",
      isbn: "9788466667128",
      editorial: "Montena",
      anioEdicion: 2020,
      medidas: "23 cm, 15.2 cm, 3.4 cm",
      numeroPaginas: 528,
      encuadernacion: "Tapa blanda",
    },
  ];
  