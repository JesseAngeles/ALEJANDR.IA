import { CompraLibro } from "./BuyBook";
import { OpinionesLibro } from "./BuyOpinion";
import { infobook } from "@/assets/data/books_info";
import { opinionbook } from "@/assets/data/books_opinion";

function BookDetails() {
    const libro = infobook[0];
    const opinion = opinionbook[0];
  
    return (
      <>
        <CompraLibro {...libro} />
        <OpinionesLibro {...opinion} />
      </>
    );
  }
  
  export { BookDetails };