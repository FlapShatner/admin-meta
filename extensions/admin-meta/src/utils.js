const fs = require('fs');
const readline = require('readline');

export const getProducts = async (products) => {
    const res = await fetch('shopify:admin/api/graphql.json', {
        method: 'POST',
        body: JSON.stringify({ query: products })
    })
    return res.json()
}

const meta = (ownerId, description) => {
    return {
        metafields: [
            {
                ownerId: ownerId,
                namespace: "custom",
                type: "single_line_text_field",
                key: "ebay_description",
                value: description
            }
        ]
    }
}

export const setMetafield = async (query, ownerId, description) => {
    const metafields = meta(ownerId, description)
    const res = await fetch('shopify:admin/api/graphql.json', {
        method: 'POST',
        body: JSON.stringify({ query: query, variables: metafields })
    })
    return res.json()
}


async function filterAndFormatJsonl(filePath, specificTitleValue) {
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const outputStream = fs.createWriteStream('output.jsonl', { flags: 'a' });

    for await (const line of rl) {
        let jsonLine;
        try {
            jsonLine = JSON.parse(line);
        } catch (error) {
            console.error('Error parsing JSON from line:', line, error);
            continue; // Skip this line if it's not valid JSON
        }

        if (jsonLine.title && jsonLine.title.includes(specificTitleValue)) {
            const formattedLine = {
                input: {
                    title: jsonLine.title,
                    id: jsonLine.id
                }
            };

            outputStream.write(JSON.stringify(formattedLine) + '\r\n');
        }
    }

    outputStream.end();
}

// Example usage:
// Assuming you have a JSONL file named 'data.jsonl' and you're looking for titles containing "Eagle"
filterAndFormatJsonl('data.jsonl', 'Eagle');

