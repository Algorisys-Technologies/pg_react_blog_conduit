import Tag from "./tag";

export default function Tags({ item }) {
    return item.tag_list.map(t => {
        return (
            <Tag key={t} tag={t} />
        );
    });
}