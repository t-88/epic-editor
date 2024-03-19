

export default function HierachyElement({title,depth}) {
    return  <div className="hierachy-element"
    
    style={{
        marginLeft: `${20 + 10 * depth}px`
    }}

    >

<p
    
    >
        {title}
    </p>

    </div>
}