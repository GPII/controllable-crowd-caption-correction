<?php

$pwd = $_POST['pwd'];
 $roomid = $_POST['roomid'];


if ($pwd=="" && $roomid=="")
{
    // tenta ler a sessao
    $pwd = $_COOKIE['pwd'];
    $roomid = $_COOKIE["roomid"];
      
} 

$myFile = $roomid."_password.txt";

    // mysql code to check room passwrod
    include('config.php');
    $result = mysql_query("SELECT * FROM admin where admin_pwd='".$pwd."' and session='".$myFile."'");
   
    
    $num_rows = mysql_num_rows($result);
    if ($num_rows>0)
    {
setcookie("pwd", $pwd);
setcookie("roomid", $roomid);


   
             mysql_close($conexao); 
    }
    else
    {
         echo "Wrong password";
          mysql_close($conexao); 
         exit;
    }
   

   
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <style type="text/css">
        .style1
        {
            width: 650px;
        }
        .style2
        {
            font-size: x-large;
        }
    </style>
</head>
<script type="text/javascript">

    function CHANGEPASS1() {

       
        xmlhttpPost4("changepass1.php", 1);
    }

    function CHANGEPASS2() {
        xmlhttpPost4("changepass2.php", 2);
    }

    function LOGOUT() {
        setCookie("roomid","");
       window.location="loginadm.htm"
    }

    function TRANSCRIPT() {

    }

 function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}


    function xmlhttpPost4(strURL, modo) {
        var xmlHttpReq = false;
        var self = this;
        // Mozilla/Safari
        if (window.XMLHttpRequest) {
            self.xmlHttpReq = new XMLHttpRequest();
        }
        // IE
        else if (window.ActiveXObject) {
            self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.open('POST', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        self.xmlHttpReq.onreadystatechange = function () {
            if (self.xmlHttpReq.readyState == 4) {
                // alert(self.xmlHttpReq.responseText);


                var str = self.xmlHttpReq.responseText;

   
                // $("#content").empty().html('');

                if (str == "OK") {

                      alert("Password changed!");
                    return;
                }
                else {
                    alert(str);
                }

            }
        }

   var MINHASALA = '<?php echo($roomid);?>';
        var NOMEDASALA = MINHASALA+"_password.txt";

        if (modo == 1) {
            var pass1 = document.getElementById("Password1").value;
            var pass2 = document.getElementById("Password2").value;
            if (pass1 != pass2) {
                alert('invalid password!');
                return;
            }
            
            if (pass1=="" || pass2=="")
                {
                 alert('invalid password!');
                return;
                }
             self.xmlHttpReq.send('pass1=' + pass1 + '&pass2=' + pass2 +'&roomid=' + NOMEDASALA);
         }

         if (modo == 2) {
             var pass1 = document.getElementById("Password3").value;
             var pass2 = document.getElementById("Password4").value;
             if (pass1 != pass2) {
                 alert('invalid password!');
                 return;
             }
              if (pass1=="" || pass2=="")
                {
                 alert('invalid password!');
                return;
                }
             self.xmlHttpReq.send('pass1=' + pass1 + '&pass2=' + pass2 +'&roomid=' + NOMEDASALA);
         }
       

    }


</script>
<body>

    <table class="style1">
        <tr>
            <td class="style2" colspan="3">
                <strong>Administrator Settings</strong></td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td colspan="3" bgcolor="#CCCCCC">
                Change Admin Password</td>
        </tr>
        <tr>
            <td>
                New Password:<input id="Password1" type="password" /></td>
            <td>
                New Password:
                <input id="Password2" type="password" />
            </td>
            <td>
                <input id="Button4" type="button" value="Change" onClick="CHANGEPASS1();"/></td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td colspan="3" bgcolor="#CCCCCC">
                Change Corrector Password</td>
        </tr>
        <tr>
            <td>
                New Password:<input id="Password3" type="password" /></td>
            <td>
                New Password:<input id="Password4" type="password" /></td>
            <td>
                <input id="Button5" type="button" value="Change" onClick="CHANGEPASS2();"/></td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <input id="Button7" type="button" value="View Transcripts" onClick="TRANSCRIPT();"/></td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <input id="Button8" type="button" value="Logout" onClick="LOGOUT();"/></td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
    </table>
    <br>
        
          <table class="style1">
              <tr>
                  <td><b>Corrector Initials</b></td>
                  <td></td>

              </tr>
<?php

 $roomid = $_POST['roomid'];
 if ($roomid=="")
{
    // tenta ler a sessao
    $pwd = $_COOKIE['pwd'];
    $roomid = $_COOKIE["roomid"];

    
} 
$myFile = $roomid."_password.txt";
//  $conexao = mysql_pconnect("174.122.236.154","root","online") or die($msg[0]);
//        mysql_select_db("sistema", $conexao);
include('config.php');
        $result = mysql_query("SELECT * FROM correctors where session='".$myFile."'");
        
        $num_rows = mysql_num_rows($result);
        if ($num_rows>0)
        {
            while ($row = mysql_fetch_array($result, MYSQL_NUM)) 
            {
                echo("<tr>");
                echo("<td>"); echo($row[2]);echo("</td>");
                
                if ($row[3]==1)
                {
                     echo("<td>"); echo("<a href='removecorrector.php?id=".$row[0]."&roomid=".$myFile."&status=0'>Unblock</a>");echo("</td>");
                    
                }
                else
                {
                 echo("<td>"); echo("<a href='removecorrector.php?id=".$row[0]."&roomid=".$myFile."&status=1'>Block</a>");echo("</td>");   
                }
               
  echo("<td>"); echo($row[4]); echo("</td>");   
                echo("</tr>");
            }
         
        }

?>
            
            </table>
</body>
</html>
