
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>ParSU-SMART | Home</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f4f6f9;
            color: #333;
        }

        header {
            background: #1d1c5a;
            color: white;
            padding: 25px 40px;
        }

        header h1 {
            margin: 0 0 8px;
        }

        header p {
            margin: 0;
        }

        nav {
            background: ##1d1c5a;
            padding: 15px 40px;
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
        }

        nav a {
            color: white;
            text-decoration: none;
            font-weight: bold;
        }

        nav a:hover {
            text-decoration: underline;
        }

        main {
            max-width: 1100px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .welcome {
            background: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .welcome h2 {
            color: #1d1c5a;
            margin-top: 0;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border-top: 5px solid #1d1c5a;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .card h3 {
            color: #1d1c5a;
            margin-top: 0;
        }

        .card p {
            line-height: 1.6;
        }

        .card a {
            display: inline-block;
            margin-top: 10px;
            background: #1d1c5a;;
            color: white;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 5px;
        }

        .card a:hover {
            background: #1d1c5a;
        }

        footer {
            text-align: center;
            padding: 20px;
            color: #666;
        }
    </style>
</head>

<body>

<header>
    <h1>ParSU-SMART</h1>
    <p>Scholarship Management and Application Records Tracking System</p>
</header>

<nav>
    <a href="index.php">Home</a>
    <a href="students.php">Students</a>
    <a href="scholarships.php">Scholarships</a>
    <a href="applications.php">Applications</a>
</nav>

<main>

    <section class="welcome">
        <h2>Welcome to ParSU-SMART!</h2>

        <p>
            This system helps manage student records, scholarship information,
            and scholarship applications in one place.
        </p>

        <p>
            Choose a section below to view the records stored in the system.
        </p>
    </section>

    <section class="cards">

        <div class="card">
            <h3>Student Records</h3>
            <p>View the student information recorded in the database.</p>
            <a href="students.php">View Students</a>
        </div>

        <div class="card">
            <h3>Scholarships</h3>
            <p>View scholarship names, descriptions, eligibility criteria, and application periods.</p>
            <a href="scholarships.php">View Scholarships</a>
        </div>

        <div class="card">
            <h3>Applications</h3>
            <p>Track student applications, review statuses, and remarks.</p>
            <a href="applications.php">View Applications</a>
        </div>

    </section>

</main>

<footer>
    <p>ParSU-SMART &copy; 2026</p>
</footer>

</body>
</html>
