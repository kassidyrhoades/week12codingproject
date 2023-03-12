
$(document).ready(function() {
    // Load all meals on page load
    loadMeals();

    // Submit form to create new meal
    $('#meal-form').submit(function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var calories = $('#calories').val();
        var date = $('#date').val();
        $.ajax({
            type: 'POST',
            url: 'https://example.com/api/meals',
            data: JSON.stringify({ name: name, calories: calories, date: date }),
            contentType: 'application/json',
            success: function() {
                loadMeals();
                $('#meal-form')[0].reset();
            },
            error: function() {
                alert('Error adding meal');
            }
        });
    });

    // Function to load all meals from API and display them in the table
    function loadMeals() {
        $.ajax({
            type: 'GET',
            url: 'https://example.com/api/meals',
            success: function(data) {
                var mealList = '';
                $.each(data, function(i, meal) {
                    mealList += '<tr><td>' + meal.name + '</td><td>' + meal.calories + '</td><td>' + meal.date + '</td><td><button class="btn btn-secondary btn-sm mr-2" onclick="editMeal(' + meal.id + ')">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteMeal(' + meal.id + ')">Delete</button></td></tr>';
                    $('#meal-list').html(mealList);
				},
				error: function() {
					alert('Error loading meals');
				}
			});
		}

		// Function to delete a meal
		function deleteMeal(id) {
			if (confirm('Are you sure you want to delete this meal?')) {
				$.ajax({
					type: 'DELETE',
					url: 'https://example.com/api/meals/' + id,
					success: function() {
						loadMeals();
					},
					error: function() {
						alert('Error deleting meal');
					}
				});
			}
		}

		// Function to edit a meal
		function editMeal(id) {
			$.ajax({
				type: 'GET',
				url: 'https://example.com/api/meals/' + id,
				success: function(meal) {
					$('#name').val(meal.name);
					$('#calories').val(meal.calories);
					$('#date').val(meal.date);
					$('#meal-form').append('<input type="hidden" id="meal-id" value="' + meal.id + '">');
					$('#meal-form').off('submit').on('submit', function(e) {
						e.preventDefault();
						var name = $('#name').val();
						var calories = $('#calories').val();
						var date = $('#date').val();
						var id = $('#meal-id').val();
						$.ajax({
							type: 'PUT',
							url: 'https://example.com/api/meals/' + id,
							data: JSON.stringify({ name: name, calories: calories, date: date }),
							contentType: 'application/json',
							success: function() {
								loadMeals();
								$('#meal-form')[0].reset();
								$('#meal-id').remove();
								$('#meal-form').off('submit').on('submit', function(e) {
									e.preventDefault();
									var name = $('#name').val();
									var calories = $('#calories').val();
									var date = $('#date').val();
									$.ajax({
										type: 'POST',
										url: 'https://example.com/api/meals',
										data: JSON.stringify({ name: name, calories: calories, date: date }),
										contentType: 'application/json',
										success: function() {
											loadMeals();
											$('#meal-form')[0].reset();
										},
										error: function() {
											alert('Error adding meal');
										}
									});
								});
							},
							error: function() {
								alert('Error updating meal');
							}
						});
					});
				},
				error: function() {
					alert('Error loading meal');
				}
			});
		}
	});