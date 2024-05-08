import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";

const embeddings = new OpenAIEmbeddings();

export const selfCriteriaQuery = async (platillos: string[]) => {
    const documents = platillos.map((pageContent, id) => {
        return new Document({
            pageContent,
            metadata: {
                id,
                text: pageContent,
            }
        })
    })

    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    const baseCompressor = new EmbeddingsFilter({
        k: 10,
        embeddings: new OpenAIEmbeddings(),
        similarityThreshold: 0.65,
      })
      
    return new ContextualCompressionRetriever({
        baseCompressor,
        baseRetriever: vectorStore.asRetriever(),
    })
}