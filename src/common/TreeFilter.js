function treeFilter(id,activities){
    let filtered_activities = [];
    activities.map(c => {
        if(c.labor_assignments.filter(a => (a.id == id)).length){
            let cat = JSON.parse(JSON.stringify(c));
            if(c.children && c.children.length){
                let children = treeFilter(id,c.children);
                cat.children = children;
            }
            filtered_activities.push(cat);
        }
        else{
            if(c.children){
                let children = treeFilter(id,c.children);
                filtered_activities = filtered_activities.concat(children);
            }
        }
    });
    return filtered_activities;
}

export default treeFilter;