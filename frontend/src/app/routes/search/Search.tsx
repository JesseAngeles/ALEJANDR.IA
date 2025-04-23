import { SearchResults } from "./SearchResults";
import { searchresults } from "@/assets/data/search_results";

function Search(){
    const busqueda = searchresults[0];
    return(
        <>
        <SearchResults {...busqueda}/>
        </>
    )
}

export { Search };