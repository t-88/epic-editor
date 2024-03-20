








export default function PopupMenu({coords,menu_data}) {
    return   <div 
        className="popup-menu" 
        onClick={(e) => {e.stopPropagation();}}
        style={{
            left:`${coords[0] - 60}px`,
            top:`${coords[1]}px`,
        }}
        >

        {menu_data.map((option,idx) => {
            return <p key={idx} onClick={option.callback}>
                {option.title}
            </p>
        }) }
</div>
}