document.addEventListener("DOMContentLoaded",function()
{
	var btn = document.getElementById('btn');

	btn.addEventListener('click',function() {
		var Request = new XMLHttpRequest();
		Request.open('GET','data.json',true);
		Request.onload = function() {
			var Data1 = JSON.parse(Request.responseText);
			var Data2 = JSON.parse(Request.responseText);
			
			Data1.forEach(pos=>{
				if(pos.parent_id==null)				// Set node 'root' and 'root' X/Y
				{
					pos['node']='root';
					pos['y']=0;
					pos['x']=0;
				}
				if(pos.parent_id!=null)				// Set 'child' for all nodes
				{
					pos['node']='child';
					pos['y']=null;
					pos['x']=null;
				}
			});
			
			var parent=Data1.filter(i=>Data2.filter(j=>i.id==j.parent_id).length>0);	// Find 'parent' nodes
			
			parent.forEach(n=>{						// Set 'parent' nodes
				if(n.node!='root')
				{
					n['node']='parent';
				}
			});
			
			var parent_id=Data1.filter((v,i,a)=>a.findIndex(t=>(t.parent_id === v.parent_id))===i)	// Find uniq 'parent_id' (no duplicates)
			var z=0;
			
			parent_id.forEach(i=>{					// Add Y value for each uniq 'parent_id'
				i['y']=z++;
			});
			
			Data1.forEach(axes);					// Set X/Y values
			function axes(a)
			{
				var id=a.id;
				var y=a.y;
				var x=a.x;
				
				if(a.node=='parent'&&a.y!=null)		// Set rest of Y values and correct prev wrong values
				{
					Data1.forEach(axisY=>{
						if(axisY.parent_id==id)
						{
							axisY['y']=y+1;
						}
					});
				}
				if(x!=null)							// Set X values
				{
					Data1.forEach(axisX=>{
						if(axisX.parent_id==id)
						{
							
							axisX['x']=x;
							x++;
						}
						if(axisX.id!=id&&axisX.x==x&&axisX.y==y)
						{
							axisX.x++;
						}
					});
				}
			}
			
			parent_id.forEach(axisX=>{				// Set first 'child' node direct under 'parent' node
				if(axisX.parent_id!=null)
				{
					Data1.forEach(x=>
					{
						if(x.id==axisX.parent_id)
						{
							x['x']=axisX.x;
						}
					});
				}
			});
			
			Data1.forEach(v=>{						// Delete unnecessary properties
				delete v.node
			});
			
			console.log(Data1);
			
			vis();
			function vis()							// Visualisation
			{
				const canvas=document.getElementById('axis');
				const ctx=canvas.getContext('2d');
				
				for(let i=0;i<Data1.length;i++)
				{
					let x=Data1[i].x;
					let y=Data1[i].y;
					let id=Data1[i].id;
					let parent_id=Data1[i].parent_id;
					
					ctx.fillStyle = 'rgb(200, 0, 0)';
					ctx.fillRect(x*100,y*100,80,80);
					ctx.fillStyle = 'rgb(255, 255, 255)';
					ctx.font = "30px Verdana";
					ctx.fillText('id '+id,x*100,y*100);
					// ctx.fillText('par: '+parent_id,x*100,y*120);
				}
			}
		};
		Request.send();
	});
});