
const feature_list = [
    {
        feature_name:"Locker Facility",
    },
    {
        feature_name:"Unlimited Wifi",
    },
    {
        feature_name:"Personal space",
    },
    {
        feature_name:"Calling Room",
    },
    {
        feature_name:"Lunch Room",
    },
    {
        feature_name:"RO Water",
    }
]

export default function(){
    return (
       <section className="absolute w-full h-full flex flex-wrap">
            {feature_list.map((feature, index) => {
                return (
                <span
                    key={index}
                    className="w-1/3 h-10 bg-yellow-500/50 border rounded px-4 py-2 text-xl"
                >
                    {feature.feature_name}
                </span>
                );
            })}
            </section>

    )
}