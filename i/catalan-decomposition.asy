unitsize(1cm);

draw((0,0) -- (5,5));
draw((0,0) -- (0,1) -- (2,3) -- (3,3), dashed);
draw((0,1) -- (0,3) -- (2,3));
draw((3,3) -- (3,5) -- (5,5));

dot((0,0), L=Label("$(0,0)$", align=S));
dot((3,3), L=Label("$(k,k)$", align=SE));
dot((5,5), L=Label("$(n,n)$", align=E));

label("$C_{k - 1}$", (1,2), align=NW);
label("$C_{n - k}$", (4,4), align=NW);
